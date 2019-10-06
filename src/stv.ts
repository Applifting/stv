import { inspect } from "util";
import { Vote, Tally, STVRound, STVOptions, STVResults } from "./model";

// As taken from https://en.wikipedia.org/wiki/Single_transferable_vote#Counting_the_votes
// votes needed to win (when fractional votes are allowed) = (valid votes cast) / (seats to fill + 1)

/**
 * Droop quota is used for establishing the amount of votes needed for winning. (See: https://en.wikipedia.org/wiki/Droop_quota)
 * @param validVotesCast 
 * @param seatsToFill 
 * @param fractionalVotesAllowed 
 */
export function getWinQuota(validVotesCast: number, seatsToFill: number, fractionalVotesAllowed: boolean): number {
  if (fractionalVotesAllowed) {
    return validVotesCast / (seatsToFill + 1);
  } else {
    return Math.floor(validVotesCast / (seatsToFill + 1)) + 1;
  }
}

export function countVotesForCandidate(candidates: string[], votes: Vote[], onlyVotesOf?: string, skipOver?: string[]): Tally {
  const tally: Tally = {};
  for (const candidate of candidates) {
    if (!(skipOver && skipOver.includes(candidate))) {
      tally[candidate] = 0;
    }
  }
  for (const vote of votes) {
    let votedCandidate: string | undefined;
    if (vote.preferences.length >= 1) {
      let index = 0;
      let candidateAtPref = vote.preferences[index];
      if (skipOver) {
        while (true) {
          if (skipOver.includes(candidateAtPref)) {
            index++;
            candidateAtPref = vote.preferences[index];
          } else {
            break;
          }
        }
      }
      if (onlyVotesOf) {
        if (onlyVotesOf == candidateAtPref) {
          // Take the second in line
          if (vote.preferences[index + 1]) {
            votedCandidate = vote.preferences[index + 1];
          }
        }
      } else {
        votedCandidate = candidateAtPref;
      }
    }
    if (votedCandidate) {
      tally[votedCandidate] = tally[votedCandidate] + vote.weight;
    }
  }

  return tally;
}


export function writeInVoteWeight(weight: number, onlyVotesOf: string, votes: Vote[], skipOver?: string[]) {
  for (const vote of votes) {
    let votedCandidate: string | undefined;
    if (vote.preferences.length >= 1) {
      let index = 0;
      let candidateAtPref = vote.preferences[index];
      if (skipOver) {
        while (true) {
          if (skipOver.includes(candidateAtPref)) {
            index++;
            candidateAtPref = vote.preferences[index];
          } else {
            break;
          }
        }
      }
      if (onlyVotesOf == candidateAtPref) {
        vote.weight = vote.weight * weight;
      }
    }
  }
}


export function max(tally: Tally) {
  let runningMax = Number.MIN_SAFE_INTEGER;
  let maxKey: string | undefined;
  for (const key in tally) {
    if (tally.hasOwnProperty(key)) {
      const votes = tally[key];
      if (votes > runningMax) {
        runningMax = votes;
        maxKey = key;
      }
    }
  }
  return { candidate: maxKey, votesCount: runningMax };
}

export function min(tally: Tally) {
  let runningMax = Number.MAX_SAFE_INTEGER;
  let maxKey: string | undefined;
  for (const key in tally) {
    if (tally.hasOwnProperty(key)) {
      const votes = tally[key];
      if (votes < runningMax) {
        runningMax = votes;
        maxKey = key;
      }
    }
  }
  return { candidate: maxKey, votesCount: runningMax };
}

export function stvRound(roundNumber: number, lastRound: STVRound | undefined, opts: {
  winQuota: number,
  candidates: string[],
  votes: Vote[],
  report: (reportLine: string) => void
}): STVRound {
  const log = opts.report;
  const winQuota = opts.winQuota;
  const lastWinners = lastRound && lastRound.winners || [];
  const lastEliminations = lastRound && lastRound.eliminated || [];
  log(`👉 ${roundNumber}. Round, Count`)
  const tally = countVotesForCandidate(opts.candidates, opts.votes, undefined, [...lastEliminations, ...lastWinners]);
  const frontrunner = max(tally);
  let winner: string | undefined;
  let eliminated: string | undefined;
  let surplusVotes: number | undefined;
  log(`∑ Tally round (${roundNumber}): ${inspect(tally)}`);
  if (frontrunner.votesCount >= winQuota) {
    winner = frontrunner.candidate;
    surplusVotes = frontrunner.votesCount - winQuota;
    const weight = surplusVotes / frontrunner.votesCount;
    log(`✅ ${winner} ELECTED! Candidate passed quota of ${winQuota} votes with ${frontrunner.votesCount} votes.`);
    log(`♻️ Amount of surplus votes: ${surplusVotes} out of ${frontrunner.votesCount} => ${weight * 100}% of remaining ballot efectivity`);
    writeInVoteWeight(weight, winner!, opts.votes, [...lastEliminations, ...lastWinners]);
  } else if ([...lastEliminations, ...lastWinners].length + 1 == opts.candidates.length) {
    log(`${frontrunner.candidate} as a LAST MAN STANDING ELECTED! (# of votes ${frontrunner.votesCount})`);
    winner = frontrunner.candidate;
  } else {
    log(`No candidate was able to pass quota of ${winQuota} votes for election.`);
    log(`☠️ ELIMINITATION!`);
    const toEliminate = min(tally);
    log(`Eliminating: ${inspect(toEliminate)}`);
    eliminated = toEliminate.candidate;
  }
  const round: STVRound = {
    number: roundNumber,
    winners: [...lastWinners],
    eliminated: [...lastEliminations],
    runningTally: tally
  }
  if (winner) {
    round.winners.push(winner);
  }
  if (eliminated) {
    round.eliminated.push(eliminated);
  }
  return round;
}



export function validateSTVOpts(options: STVOptions) {
  const noop = () => { };
  const log = options.report || noop;
}

/**
 * 
 * 
 * This works effectively according to Scottish STV Rules. See more at: https://www.opavote.com/methods/scottish-stv-rules
 * @param opts 
 * 
 */
export function stv(opts: STVOptions): STVResults {
  const rounds: STVRound[] = [];
  const noop = () => { };
  const log = opts.report || noop;
  const weightedVoteCount = opts.votes.filter(v => v.preferences.length > 0).map(v => v.weight).reduce((prev, cur) => prev + cur, 0);
  log(`🗳 Number of valid votes count: ${weightedVoteCount}  (weighted)`);
  const winQuota = getWinQuota(weightedVoteCount, opts.seatsToFill, false);
  log(`🧗‍ Win quota to be elected: ${winQuota}  (weighted)`);

  let lastRound: STVRound | undefined = undefined;
  for (let roundNumber = 1; roundNumber < 20; roundNumber++) {
    lastRound = stvRound(roundNumber, lastRound, { ...opts, winQuota: winQuota, votes: opts.votes, report: log });
    rounds.push(lastRound);
    log(``);
    if (lastRound.winners.length >= opts.seatsToFill) {
      log('🏛 STV Computation Completed. 🏛')
      log(`🎉 Winners: ${lastRound.winners} 🎉`);
      log(``)
      break;
    }
  }

  return {
    validVotesCount: weightedVoteCount,
    winQuota: winQuota,
    winners: lastRound!.winners,
    rounds: rounds
  };
}
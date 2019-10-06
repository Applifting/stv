
export interface Vote {
  /**
   * Weight of the vote. If you do not have weighted votes, use 1.
   */
  weight: number
  /**
   * Candidates, ordered from the most preferred ones to the one preffered least
   */
  preferences: string[];
}

/**
 * Tally of votes in format -> name of candidate: number of votes
 */
export interface Tally {
  [candidate: string]: number;
}

/**
 * Results of STV elections
 */
export interface STVResults {
  validVotesCount: number;
  winQuota: number;
  winners: string[];
  rounds: STVRound[];
}

export interface STVRound {
  number: number;
  winners: string[];
  eliminated: string[];
  runningTally: Tally;
}

export interface STVOptions {
  seatsToFill: number,
  candidates: string[],
  votes: Vote[],
  report?: (reportLine: string) => void
}
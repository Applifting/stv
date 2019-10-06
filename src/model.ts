
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
  /**
   * Number of valid votes, excluding blank ballots.
   */
  validVotesCount: number;
  /**
   * Number of votes required for the candidate to be elected.
   */
  winQuota: number;
  /**
   * Winners in the order starting from the most favored candidate.
   */
  winners: string[];
  /**
   * Detailed statistics and information abour each election round.
   */
  rounds: STVRound[];
}

export interface STVRound {
  number: number;
  winners: string[];
  eliminated: string[];
  runningTally: Tally;
}

/**
 * Options of the STV
 */
export interface STVOptions {
  /**
   * Number of seats to fill / Candidates to elect.
   */
  seatsToFill: number,
  /**
   * Names of the candidates. Order does not matter.
   */
  candidates: string[],
  /**
   * All ballots/votes casted in the elections.
   */
  votes: Vote[],
  /**
   * Optional reporting function. 
   * It is called during each step of the algorithm.
   * It receives step-by-step information during the process of determining the election winners.
   */
  report?: (reportLine: string) => void
}
/* istanbul ignore file */
import { Vote } from "../model";
import { repeat } from "../utils";
export const andreaSymbol = "Andrea";
export const bradSymbol = "Brad";
export const carterSymbol = "Carter";
export const delilahSymbol = "Delilah";

//As taken from https://en.wikipedia.org/wiki/Counting_single_transferable_votes

export function getExampleElectionData(): { candidates: string[], votes: Vote[], seatsToFill: number } {

  const candidates = [andreaSymbol, bradSymbol, carterSymbol, delilahSymbol];



  const votes: Vote[] = [];

  repeat(16, () => {
    votes.push({
      weight: 1,
      preferences: [andreaSymbol, bradSymbol, carterSymbol, delilahSymbol]
    });
  });

  repeat(24, () => {
    votes.push({
      weight: 1,
      preferences: [andreaSymbol, carterSymbol, bradSymbol, delilahSymbol]
    });
  });

  repeat(17, () => {
    votes.push({
      weight: 1,
      preferences: [delilahSymbol, andreaSymbol, bradSymbol, carterSymbol]
    });
  });

  return {
    candidates: candidates,
    votes: votes,
    seatsToFill: 2
  }
}


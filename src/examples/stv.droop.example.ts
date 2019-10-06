import { Vote } from "../model";
import { repeat } from "../utils";
export const andreaSymbol = "Andrea";
export const bradSymbol = "Brad";
export const carterSymbol = "Carter";

//As taken from https://en.wikipedia.org/wiki/Droop_quota

export function getExampleElectionData(): { candidates: string[], votes: Vote[], seatsToFill: number } {

  const candidates = [andreaSymbol, carterSymbol, bradSymbol];



  const votes: Vote[] = [];

  repeat(45, () => {
    votes.push({
      weight: 1,
      preferences: [andreaSymbol, carterSymbol]
    });
  });

  repeat(25, () => {
    votes.push({
      weight: 1,
      preferences: [carterSymbol]
    });
  });

  repeat(30, () => {
    votes.push({
      weight: 1,
      preferences: [bradSymbol]
    });
  });

  return {
    candidates: candidates,
    votes: votes,
    seatsToFill: 2
  }
}


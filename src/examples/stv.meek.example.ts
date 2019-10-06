import { Vote } from "../model";
import { repeat } from "../utils";
export const aliceSymbol = "Alice";
export const bobSymbol = "Bob";
export const chrisSymbol = "Chris";
export const donSymbol = "Don";
export const ericSymbol = "Eric";

// As taken from https://blog.opavote.com/2017/04/meek-stv-explained.html

export function getExampleElectionData(): { candidates: string[], votes: Vote[], seatsToFill: number } {

  const candidates = [aliceSymbol, bobSymbol, chrisSymbol, donSymbol, ericSymbol];



  const votes: Vote[] = [];

  repeat(28, () => {
    votes.push({
      weight: 1,
      preferences: [aliceSymbol, bobSymbol, chrisSymbol]
    });
  });

  repeat(26, () => {
    votes.push({
      weight: 1,
      preferences: [bobSymbol, aliceSymbol, chrisSymbol]
    });
  });

  repeat(3, () => {
    votes.push({
      weight: 1,
      preferences: [chrisSymbol]
    });
  });

  repeat(2, () => {
    votes.push({
      weight: 1,
      preferences: [donSymbol]
    });
  });

  repeat(1, () => {
    votes.push({
      weight: 1,
      preferences: [ericSymbol]
    });
  });

  return {
    candidates: candidates,
    votes: votes,
    seatsToFill: 3
  }
}


/* istanbul ignore file */
import { Vote } from "../model";
import { repeat } from "../utils";
export const orangeSymbol = "Orange";
export const pearSymbol = "Pear";
export const chocolateSymbol = "Chocolate";
export const strawberrySymbol = "Strawberry";
export const candySymbol = "Candy";


export function getExampleElectionData(): { candidates: string[], votes: Vote[], seatsToFill: number } {

  const candidates = [orangeSymbol, pearSymbol, chocolateSymbol, strawberrySymbol, candySymbol];



  const votes: Vote[] = [];

  repeat(4, () => {
    votes.push({
      weight: 1,
      preferences: [orangeSymbol]
    });
  });

  repeat(2, () => {
    votes.push({
      weight: 1,
      preferences: [pearSymbol, orangeSymbol]
    });
  });

  repeat(8, () => {
    votes.push({
      weight: 1,
      preferences: [chocolateSymbol, strawberrySymbol]
    });
  });

  repeat(4, () => {
    votes.push({
      weight: 1,
      preferences: [chocolateSymbol, candySymbol]
    });
  });

  repeat(1, () => {
    votes.push({
      weight: 1,
      preferences: [strawberrySymbol]
    });
  });

  repeat(1, () => {
    votes.push({
      weight: 1,
      preferences: [candySymbol]
    });
  });

  return {
    candidates: candidates,
    votes: votes,
    seatsToFill: 3
  }
}


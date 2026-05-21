export function getFeeder(identifier: string, index: number): string {
  const feeder = process.env[`feeder${index}`];

  if (feeder && feeder.trim() !== "") {
    if (feeder.toLowerCase() === "default") {
      return identifier;
    }
    return feeder;
  }

  return identifier;
}

import { RingProgress, Text } from "@mantine/core";

export const GameScoreBadge = ({ score }: { score: number }) => {
  const color = score >= 80 ? "green" : score >= 60 ? "yellow" : "red";

  return (
    <RingProgress
      ml={4}
      size={28}
      thickness={2}
      sections={[{ value: score, color }]}
      label={
        <Text align="center" size={12} color={color}>
          {score}
        </Text>
      }
    />
  );
};

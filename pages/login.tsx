import { Box, Input, Button } from "@reactants/ui";
import { LogIn, Circle } from "react-feather";
import { useState, FormEvent } from "react";

export default () => {
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [loading, setLoading] = useState<boolean>();
  const filterUsername = (u: string) => u.replace(/[^\w\s]/gi, "");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username || !password) return;
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <main className="sm:max-w-sm p-5 mx-auto mt-12 space-y-7">
      <h1 className="font-medium text-center mb-5 text-4xl">Sign In</h1>
      <Box>
        <Box.Header>Enter your credentials</Box.Header>
        <Box.Content className="px-5 py-6">
          <form onSubmit={onSubmit} className="space-y-5">
            <Input
              value={username}
              onChange={(e) => setUsername(filterUsername(e.target.value))}
              label="Username"
              placeholder="jessica"
            />

            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              type="password"
              placeholder="••••••••••"
            />

            <Button
              loading={loading}
              icon={<LogIn />}
              size="lg"
              className="w-full"
              color="primary"
            >
              Sign In
            </Button>
          </form>
        </Box.Content>
      </Box>

      <Box>
        <Box.Header>Sign in another way</Box.Header>
        <Box.Content className="space-y-5 px-5 py-6">
          <Button
            disabled={true}
            icon={<Circle />}
            size="lg"
            className="w-full"
            color="inverted"
          >
            Sign In With Pulsar
          </Button>
        </Box.Content>
      </Box>
    </main>
  );
};

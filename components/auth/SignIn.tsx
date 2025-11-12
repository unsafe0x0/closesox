import React from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

const SignIn: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn("credentials", { email, password, redirect: true });
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto mt-16 bg-card border border-border rounded-lg p-8 shadow-md animate-in fade-in zoom-in">
      <h2 className="text-2xl font-bold mb-6 text-center text-primary">
        Signin to closesox
      </h2>
      <div className="w-full flex items-center justify-center mb-6">
        <div className="w-full">
          <Button
            variant="secondary"
            size="large"
            className="w-full"
            onClick={() => signIn("google", { redirect: true })}
          >
            <FcGoogle size={22} /> Sign in with Google
          </Button>
        </div>
      </div>
      <div className="flex items-center my-6">
        <div className="grow border-t border-border" />
        <span className="mx-4 text-muted-foreground">or</span>
        <div className="grow border-t border-border" />
      </div>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={setEmail}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={setPassword}
          required
        />
        <div className="w-full">
          <Button
            variant="primary"
            size="medium"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignIn;

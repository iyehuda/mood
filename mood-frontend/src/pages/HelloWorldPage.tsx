import HelloWorldGreeting from "../components/HelloWorldGreeting";
import HelloWorldVersion from "../components/HelloWorldVersion";
import Logo from "../components/Logo";

function HelloWorldPage() {
  return (
    <>
      <Logo />
      <p>Welcome to Mood!</p>
      <HelloWorldGreeting />
      <HelloWorldVersion />
    </>
  );
}

export default HelloWorldPage;

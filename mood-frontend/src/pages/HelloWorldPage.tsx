import Card from "@mui/material/Card";
import HelloWorldGreeting from "../components/HelloWorldGreeting";
import HelloWorldVersion from "../components/HelloWorldVersion";
import MoodLogo from "../components/logos/MoodLogo.tsx";
import { CardActions, CardContent, CardHeader, Divider } from "@mui/material";

function HelloWorldPage() {
  return (
    <div>
      <MoodLogo />
      <Card variant="outlined" sx={{ p: 1 }}>
        <CardHeader title="Welcome to Mood!" />
        <Divider />
        <CardContent>
          <HelloWorldGreeting />
        </CardContent>
        <CardActions>
          <HelloWorldVersion />
        </CardActions>
      </Card>
    </div>
  );
}

export default HelloWorldPage;

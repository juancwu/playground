import { Button, Container, Divider, JsonInput, Title } from "@mantine/core";
import { type NextPage } from "next";
import { useState } from "react";

async function autoCodeQuery() {
  try {
    const res = await fetch(
      "https://juancwu.api.stdlib.com/notion-integration@dev/",
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTOCODE_TOKEN}`,
        },
      }
    );
    const json = await res.json();
    console.log(json);
    return json;
  } catch (error) {
    console.error(error);
  }
}

async function customBackend() {
  try {
    const res = await fetch("/api/query");
    if (res.status === 200) {
      const json = await res.json();
      console.log(json);
      return json;
    } else {
      console.log("Error: query unsuccessful.");
    }
  } catch (error) {
    console.error(error);
  }
}

const Home: NextPage = () => {
  const [json, setJson] = useState("");

  return (
    <Container>
      <Title>Demo: Ways to Integrate Notion</Title>
      <Divider />
      <Container my={20}>
        <Title order={2}>Use Custom Backend</Title>
        <Button
          my={10}
          onClick={async () => {
            const jsonObj = await customBackend();
            setJson(JSON.stringify(jsonObj, null, 2));
          }}
        >
          Try
        </Button>
      </Container>
      <Divider />
      <Container my={20}>
        <Title order={2}>Use Autocode Service</Title>
        <Button
          my={10}
          onClick={async () => {
            const jsonObj = await autoCodeQuery();
            setJson(JSON.stringify(jsonObj, null, 2));
          }}
        >
          Try
        </Button>
      </Container>
      <Container>
        <JsonInput
          label="Results"
          value={json}
          autosize={true}
          formatOnBlur={true}
          maxRows={30}
        />
      </Container>
    </Container>
  );
};

export default Home;

import {
  Heading,
  Page,
  Button,
  Navigation,
  Stack,
  Badge,
} from "@shopify/polaris";
import { useState, useCallback } from "react";


export default function App() {

  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );

  const tabs = [
    {
      id: "all-customers-1",
      content: "Create Bundle",
      accessibilityLabel: "All customers",
      panelID: "all-customers-content-1",
    },
    {
      id: "accepts-marketing-1",
      content: "Settings",
      panelID: "accepts-marketing-content-1",
    },
  ];

  return (
    <Page fullWidth>
      <Heading>SyncIt App Heading</Heading>

      <Card>
        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
          <Card.Section title={tabs[selected].content}>
            <p>Tab {selected} selected</p>
          </Card.Section>
        </Tabs>
      </Card>
      <Button ariaExpanded={false}>Add product</Button>
    </Page>
  );

}

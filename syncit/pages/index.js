import { Page, Card, Tabs, Button } from "@shopify/polaris";
import { useState, useCallback, useEffect, useMemo } from "react";

export default function App() {
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );

  const handleButtonClick = () => {
    alert("Button clicked...");
  }

  useEffect(() => {
    alert("Welcome to SyncIt!");
  }, []);

  const tabs = [
    {
      id: "create-bundle-1",
      content: "Create Bundle",
      accessibilityLabel: "Create Bundle",
      panelID: "create-bundle-content-1",
    },
    {
      id: "settings-1",
      content: "Settings",
      panelID: "settings-content-1",
    },
  ];

  return (
    <Page fullWidth>
      <Card>
        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
          <Card.Section title={tabs[selected].content}>
            <p>Tab {selected} selected</p>
          </Card.Section>
        </Tabs>

        <Button primary onClick={handleButtonClick}>Select Product</Button>

      </Card>
    </Page>
  );
}

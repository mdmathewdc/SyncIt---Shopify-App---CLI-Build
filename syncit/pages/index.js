import { Page, Card, Tabs } from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";

export default function App() {
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );

  useEffect( () => {
    alert("Re-rendered!");
  });


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
      </Card>
    </Page>
  );
}

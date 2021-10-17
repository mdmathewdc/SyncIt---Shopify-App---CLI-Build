import { Page, Card, Tabs, Button } from "@shopify/polaris";
import { useState, useCallback, useEffect, useMemo } from "react";
import Create from './create/Create';

export default function App() {
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );

  const handleButtonClick = () => {

    console.log("Button clicked...");
    fetch('/home')
    .then( response => response.json())
    .then( data => alert(data));

  } 
  

  useEffect(() => {
    console.log("React app loaded");
  }, []);

  const tabs = [
    {
      id: "create-bundle-1",
      content: "Create Bundle",
      title: "Select a product to create a Bundle",
      accessibilityLabel: "Create Bundle",
      panelID: "create-bundle-content-1",
    },
    {
      id: "settings-1",
      content: "Settings",
      title: "No title required here",
      panelID: "settings-content-1",
    },
  ];

  return (
    <Page fullWidth>
      <Card>
        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
          <Card.Section title={tabs[selected].title}>
            {/* <p>Tab {selected} selected</p> */}
            <Button primary onClick={handleButtonClick}>Select Product</Button>
            <Create parameter={"hello"}/>
          </Card.Section>
        </Tabs>
      </Card>
    </Page>
  );
}

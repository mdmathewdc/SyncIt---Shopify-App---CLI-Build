import { Heading, Page, Button, Navigation, Stack, Badge } from "@shopify/polaris";
import {HomeMajor, OrdersMajor, ProductsMajor} from '@shopify/polaris-icons';


const Index = () => (



  <Page>
      <Stack>
  <Badge>Paid</Badge>
  <Badge>Processing</Badge>
  <Badge>Fulfilled</Badge>
  <Badge>Completed</Badge>
</Stack>
    <Heading> I changed the heading of the App</Heading>
    <Navigation location="/">
      <Navigation.Section
        items={[
          {
            url: "/path/to/place",
            label: "Home",
            icon: HomeMajor,
          },
          {
            url: "/path/to/place",
            label: "Orders",
            icon: OrdersMajor,
            badge: "15",
          },
          {
            url: "/path/to/place",
            label: "Products",
            icon: ProductsMajor,
          },
        ]}
      />
    </Navigation>

    <Button ariaExpanded={false}>Add product</Button>
  </Page>
);

export default Index;

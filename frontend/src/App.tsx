import "./App.css";
import { Page } from "./Containers/Page.tsx";
import { AppProviders } from "./Containers/Providers.tsx";
import { ProductManager } from "./Containers/ProductManager.tsx";

function App() {
  return (
    <AppProviders>
      <Page
        title="Product Manager"
        description="Upload your csv with product data. We're currently accepting CSV's in below format. You can also add your products with below form."
      >
        <ProductManager />
      </Page>
    </AppProviders>
  );
}

export default App;

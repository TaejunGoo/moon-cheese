import { RouterProvider } from 'react-router';
import router from './router';
import { CurrencyProvider } from './ui-lib/components/currency-context';

function App() {
  return (
    <CurrencyProvider>
      <RouterProvider router={router} />
    </CurrencyProvider>
  );
}

export default App;

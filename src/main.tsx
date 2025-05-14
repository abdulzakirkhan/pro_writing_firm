import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { Provider } from "react-redux";
import {store} from "./redux/store.ts"
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51NkKxCIDvqClqRenONst52QWoDYzp6xIDzhQPvomHMA0cyMgrXEMuRdTDUMMMOqu5wraiYxVXA73XZIerEU0eECU00HnhGvGpe');

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <AppWrapper>
        <Elements stripe={stripePromise}> 
          <App />
          </Elements>
        </AppWrapper>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);

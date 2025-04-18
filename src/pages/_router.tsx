import ErrorBoundary from "@/lib/sw-toolkit/components/ErrorBoundary.tsx";
import { BrowserRouter, Route, Routes, useParams } from "react-router";

import Layout from "./_layout.tsx";
import NotFound from "./_not-found.tsx";
import MainPage from "./main-page";
import Page1 from "./page1";

const pages = [MainPage, Page1];
export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route>
            <Route index element={<MainPage />} />
            <Route
              path=":pageid"
              element={
                <ErrorBoundary>
                  <PageById />
                </ErrorBoundary>
              }
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function PageById() {
  const { pageid } = useParams();

  const Page = pages[+pageid!];

  return <Page />;
}

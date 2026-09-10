import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageLoader from "../components/PageLoader";

export const metadata = {
  title: "DYFI Dakshina Kannada — District Committee",
  description: "Democratic Youth Federation of India (DYFI) Dakshina Kannada District Committee. Organizing youth for progress, communal harmony, and social justice in the coastal region.",
  icons: {
    icon: "/images/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/images/logo.png" />
      </head>
      <body>
        <PageLoader>
          <Navbar />
          {children}
          <Footer />
        </PageLoader>
      </body>
    </html>
  );
}

// routes
import Routes from './routes'
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/scroll-to-top';
import { StyledChart } from './components/chart';
import {AuthProvider} from "./providers/auth-provider/AuthProvider";

// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeProvider>
        <AuthProvider>
            <ScrollToTop />
            <StyledChart />
            <Routes/>
        </AuthProvider>
    </ThemeProvider>
  );
}

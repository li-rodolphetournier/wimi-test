import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

console.log('🔧 React test starting...');

const rootElement = document.getElementById('root');
if (rootElement) {
  console.log('✅ Root element found');
  try {
    const root = createRoot(rootElement);
    console.log('✅ React root created');

    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    console.log('✅ React app rendered');
  } catch (error) {
    console.error('❌ React render error:', error);
    rootElement.innerHTML = '<h1 style="color: red;">❌ REACT ERROR</h1>';
  }
} else {
  console.error('❌ Root element not found');
  document.body.innerHTML = '<h1 style="color: red;">❌ ROOT MISSING</h1>';
}

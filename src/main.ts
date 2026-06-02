import './app.css';
import App from './App.svelte';
import { inject } from '@vercel/analytics';

const target = document.getElementById('app');
if (!target) throw new Error('Missing #app root element');

new App({ target });
inject();

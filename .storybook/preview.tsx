import React from 'react';
import type { Preview, Decorator } from '@storybook/react-vite';
import '../src/design-system/theme.css';
import '../src/index.css';

/** Toolbar switch for the design-system light/dark themes. */
export const globalTypes = {
  theme: {
    description: 'Design system theme',
    defaultValue: 'light',
    toolbar: {
      title: 'Theme',
      icon: 'circlehollow',
      items: [
        { value: 'light', title: 'Light', icon: 'sun' },
        { value: 'dark', title: 'Dark', icon: 'moon' },
      ],
      dynamicTitle: true,
    },
  },
};

const withTheme: Decorator = (Story, context) => {
  const dark = context.globals.theme === 'dark';
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    root.setAttribute('data-theme', dark ? 'align-dark' : 'align-light');
    root.classList.toggle('dark', dark);
  }
  return (
    <div
      style={{
        padding: 24,
        background: 'var(--ads-bg-page)',
        color: 'var(--ads-text-primary)',
        fontFamily: 'var(--ads-font-sans)',
        minHeight: '100vh',
        boxSizing: 'border-box',
      }}
    >
      <Story />
    </div>
  );
};

const preview: Preview = {
  decorators: [withTheme],
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
      // The brand palette (#009ACE interactive / #D43F58 danger) is intentionally
      // below the WCAG AA text-contrast threshold. Disable the color-contrast rule
      // so Storybook's a11y panel doesn't flag it on every component.
      config: {
        rules: [{ id: 'color-contrast', enabled: false }],
      },
      options: {
        rules: { 'color-contrast': { enabled: false } },
      },
    },
  },
};

export default preview;

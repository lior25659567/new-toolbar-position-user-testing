import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs, TabPanel } from '../index';

const ITEMS = [
  { id: 'overview', label: 'Overview' },
  { id: 'specs', label: 'Specs' },
  { id: 'activity', label: 'Activity' },
  { id: 'disabled', label: 'Disabled', disabled: true },
];

const meta = {
  title: 'Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs', 'ai-generated'],
  args: { items: ITEMS },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [active, setActive] = React.useState('overview');
    return (
      <div style={{ width: 460 }}>
        <Tabs items={ITEMS} activeId={active} onChange={setActive} />
        <TabPanel tabId="overview" activeId={active}>Overview content.</TabPanel>
        <TabPanel tabId="specs" activeId={active}>Specs content.</TabPanel>
        <TabPanel tabId="activity" activeId={active}>Activity content.</TabPanel>
      </div>
    );
  },
};

export const ItemStates: Story = {
  render: () => {
    const STATE_ITEMS = [
      { id: 'd', label: 'Default' },
      { id: 's', label: 'Selected' },
      { id: 'h', label: 'Hover', forceState: 'hover' as const },
      { id: 'f', label: 'Focused', forceState: 'focus' as const },
      { id: 'x', label: 'Disabled', disabled: true },
    ];
    const [active, setActive] = React.useState('s');
    return (
      <div style={{ width: 460 }}>
        <Tabs items={STATE_ITEMS} activeId={active} onChange={setActive} />
        {/* Render the active panel so each tab's aria-controls resolves to a real element. */}
        {STATE_ITEMS.map((it) => (
          <TabPanel key={it.id} tabId={it.id} activeId={active}>
            {it.label} content.
          </TabPanel>
        ))}
      </div>
    );
  },
};

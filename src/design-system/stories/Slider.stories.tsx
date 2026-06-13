import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Slider } from '../index';

const meta = {
  title: 'Inputs/Slider',
  component: Slider,
  tags: ['autodocs', 'ai-generated'],
  args: { value: 40 },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  render: () => {
    const [v, setV] = React.useState(40);
    return <div style={{ width: 320 }}><Slider label="Opacity" value={v} onChange={(n) => setV(n as number)} formatValue={(n) => `${n}%`} /></div>;
  },
};

export const Ranged: Story = {
  render: () => {
    const [v, setV] = React.useState<[number, number]>([20, 70]);
    return <div style={{ width: 320 }}><Slider label="Price range" value={v} onChange={(n) => setV(n as [number, number])} formatValue={(n) => `$${n}`} /></div>;
  },
};

export const Disabled: Story = {
  render: () => <div style={{ width: 320 }}><Slider label="Opacity" value={50} onChange={() => {}} disabled formatValue={(n) => `${n}%`} /></div>,
};

export const HandleStates: Story = {
  render: () => (
    <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Slider label="Hover" value={60} onChange={() => {}} forceState="hover" />
      <Slider label="Active" value={60} onChange={() => {}} forceState="active" />
      <Slider label="Focused" value={60} onChange={() => {}} forceState="focus" />
    </div>
  ),
};

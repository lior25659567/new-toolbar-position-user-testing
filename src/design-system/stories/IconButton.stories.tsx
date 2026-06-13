import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { IconButton } from '../index';

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M10.5 3.5L3.5 10.5M3.5 3.5l7 7" />
  </svg>
);

const meta = {
  title: 'Actions/Icon Button',
  component: IconButton,
  tags: ['autodocs', 'ai-generated'],
  args: { 'aria-label': 'Close', children: <CloseIcon />, onClick: fn() },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <IconButton aria-label="Close" size="sm"><CloseIcon /></IconButton>
      <IconButton aria-label="Close" size="md"><CloseIcon /></IconButton>
      <IconButton aria-label="Close" size="lg"><CloseIcon /></IconButton>
    </div>
  ),
};

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <IconButton aria-label="Default"><CloseIcon /></IconButton>
      <IconButton aria-label="Hover" {...{ 'data-force': 'hover' }}><CloseIcon /></IconButton>
      <IconButton aria-label="Pressed" {...{ 'data-force': 'pressed' }}><CloseIcon /></IconButton>
      <IconButton aria-label="Focused" {...{ 'data-force': 'focus' }}><CloseIcon /></IconButton>
      <IconButton aria-label="Disabled" disabled><CloseIcon /></IconButton>
    </div>
  ),
};

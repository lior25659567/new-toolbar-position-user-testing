import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, expect } from 'storybook/test';
import {
  PrimaryButton,
  SecondaryButton,
  GhostButton,
  LinkButton,
  WarningButton,
} from '../index';

const meta = {
  title: 'Actions/Button',
  component: PrimaryButton,
  tags: ['autodocs', 'ai-generated'],
  args: { children: 'Button', onClick: fn() },
  argTypes: {
    size: { control: 'inline-radio', options: [36, 44, 60] },
    disabled: { control: 'boolean' },
    selected: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof PrimaryButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Secondary: Story = { render: (a) => <SecondaryButton {...a} /> };
export const Ghost: Story = { render: (a) => <GhostButton {...a} /> };
export const Link: Story = { render: (a) => <LinkButton {...a} /> };
export const Danger: Story = { render: (a) => <WarningButton {...a} /> };

export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <PrimaryButton>Primary</PrimaryButton>
      <SecondaryButton>Secondary</SecondaryButton>
      <GhostButton>Ghost</GhostButton>
      <LinkButton>Link</LinkButton>
      <WarningButton>Danger</WarningButton>
    </div>
  ),
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <PrimaryButton size={36}>Small</PrimaryButton>
      <PrimaryButton size={44}>Medium</PrimaryButton>
      <PrimaryButton size={60}>Large</PrimaryButton>
    </div>
  ),
};

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <PrimaryButton>Default</PrimaryButton>
      {/* data-force renders the interaction state statically */}
      <PrimaryButton {...{ 'data-force': 'hover' }}>Hover</PrimaryButton>
      <PrimaryButton {...{ 'data-force': 'pressed' }}>Pressed</PrimaryButton>
      <PrimaryButton {...{ 'data-force': 'focus' }}>Focused</PrimaryButton>
      <PrimaryButton disabled>Disabled</PrimaryButton>
    </div>
  ),
};

/**
 * Proves the design-system CSS actually loaded in the preview: PrimaryButton's
 * background resolves from --ads-background-interactive (#009ACE). If theme.css
 * failed to load, this computed value would not be rgb(0, 154, 206).
 */
export const CssCheck: Story = {
  args: { children: 'Submit' },
  parameters: { controls: { disable: true } },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: /submit/i });
    await expect(getComputedStyle(button).backgroundColor).toBe('rgb(0, 154, 206)');
  },
};

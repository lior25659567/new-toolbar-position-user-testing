import type { Meta, StoryObj } from '@storybook/react-vite';
import { NumberInput } from '../index';

const meta = {
  title: 'Inputs/Number Input',
  component: NumberInput,
  tags: ['autodocs', 'ai-generated'],
  args: { label: 'Quantity', defaultValue: 5 },
  argTypes: {
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    error: { control: 'text' },
    helper: { control: 'text' },
    disabled: { control: 'boolean' },
    forceFocus: { control: 'boolean' },
  },
  parameters: { layout: 'centered' },
  decorators: [(S) => <div style={{ width: 220 }}><S /></div>],
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focused: Story = { args: { forceFocus: true, helper: 'Primary border + focus ring' } };
export const WithRange: Story = { args: { min: 1, max: 10, helper: '1–10' } };
export const Step: Story = { args: { step: 0.5, defaultValue: 2.5 } };
export const Error: Story = { args: { error: 'Must be a positive number' } };
export const Disabled: Story = { args: { disabled: true } };

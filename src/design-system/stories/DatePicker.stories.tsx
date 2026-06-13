import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { DatePicker } from '../index';

const meta = {
  title: 'Pickers/Date Picker',
  component: DatePicker,
  tags: ['autodocs', 'ai-generated'],
  args: { label: 'Start date', onChange: fn() },
  argTypes: {
    min: { control: 'text' },
    max: { control: 'text' },
    error: { control: 'text' },
    helper: { control: 'text' },
    disabled: { control: 'boolean' },
    forceFocus: { control: 'boolean' },
    defaultOpen: { control: 'boolean' },
  },
  parameters: { layout: 'centered' },
  decorators: [(S) => <div style={{ width: 260, minHeight: 380 }}><S /></div>],
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithValue: Story = { args: { defaultValue: '1990-06-15', label: 'Birthday' } };
export const Focused: Story = { args: { forceFocus: true } };
export const Open: Story = { args: { defaultOpen: true, defaultValue: '2026-06-15' } };
export const WithRange: Story = { args: { min: '2026-01-01', max: '2026-12-31', helper: '2026 only' } };
export const Error: Story = { args: { error: 'Date is required' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: '2025-01-01' } };

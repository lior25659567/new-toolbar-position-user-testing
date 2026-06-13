import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { DropdownList } from '../index';

const OPTIONS = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'il', label: 'Israel' },
  { value: 'de', label: 'Germany' },
];

const meta = {
  title: 'Pickers/Dropdown List',
  component: DropdownList,
  tags: ['autodocs', 'ai-generated'],
  args: { label: 'Country', placeholder: 'Select country', options: OPTIONS, onChange: fn() },
  argTypes: {
    error: { control: 'text' },
    helper: { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    menuPlacement: { control: 'inline-radio', options: ['bottom', 'top'] },
    forceFocus: { control: 'boolean' },
    defaultOpen: { control: 'boolean' },
  },
  parameters: { layout: 'centered' },
  decorators: [(S) => <div style={{ width: 280, minHeight: 280 }}><S /></div>],
} satisfies Meta<typeof DropdownList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selected: Story = { args: { defaultValue: 'il' } };
export const Focused: Story = { args: { forceFocus: true } };
export const Open: Story = { args: { defaultOpen: true, defaultValue: 'il' } };
export const Error: Story = { args: { error: 'Selection required' } };
export const Disabled: Story = { args: { disabled: true, placeholder: 'Unavailable' } };

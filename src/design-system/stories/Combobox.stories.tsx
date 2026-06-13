import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Combobox } from '../index';

const OPTIONS = [
  { value: 'amber', label: 'Amber' },
  { value: 'azure', label: 'Azure' },
  { value: 'coral', label: 'Coral' },
  { value: 'indigo', label: 'Indigo' },
  { value: 'ivory', label: 'Ivory' },
  { value: 'magenta', label: 'Magenta' },
  { value: 'olive', label: 'Olive' },
  { value: 'scarlet', label: 'Scarlet' },
];

const meta = {
  title: 'Pickers/Combobox',
  component: Combobox,
  tags: ['autodocs', 'ai-generated'],
  args: { label: 'Color', options: OPTIONS, placeholder: 'Search colors…', onChange: fn() },
  argTypes: {
    layerSet: { control: 'inline-radio', options: ['white', 'grey'] },
    searchable: { control: 'boolean' },
    error: { control: 'text' },
    helper: { control: 'text' },
    disabled: { control: 'boolean' },
    forceFocus: { control: 'boolean' },
    defaultOpen: { control: 'boolean' },
  },
  parameters: { layout: 'centered' },
  decorators: [(S) => <div style={{ width: 280, minHeight: 280 }}><S /></div>],
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focused: Story = { args: { forceFocus: true } };
export const Open: Story = { args: { defaultOpen: true, defaultValue: 'indigo' } };
export const NonSearchable: Story = { args: { searchable: false } };
export const Error: Story = { args: { error: 'Please choose one' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'indigo' } };

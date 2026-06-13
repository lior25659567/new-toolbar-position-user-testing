import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { SearchInput } from '../index';

const meta = {
  title: 'Inputs/Search',
  component: SearchInput,
  tags: ['autodocs', 'ai-generated'],
  args: { placeholder: 'Search…', onSearch: fn() },
  argTypes: {
    clearable: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    disabled: { control: 'boolean' },
    forceFocus: { control: 'boolean' },
  },
  parameters: { layout: 'centered' },
  decorators: [(S) => <div style={{ width: 320 }}><S /></div>],
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focused: Story = { args: { forceFocus: true } };
export const WithValue: Story = { args: { defaultValue: 'design tokens' } };
export const FullWidth: Story = { args: { fullWidth: true } };
export const Disabled: Story = { args: { disabled: true } };

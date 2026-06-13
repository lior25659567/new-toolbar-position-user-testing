import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioGroup, RadioItem } from '../index';

const meta = {
  title: 'Selection/Radio',
  component: RadioGroup,
  tags: ['autodocs', 'ai-generated'],
  args: { name: 'radio', children: <RadioItem value="a" label="Option A" /> },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <RadioGroup name="r-default" defaultValue="a">
      <RadioItem value="a" label="Option A" />
      <RadioItem value="b" label="Option B" />
      <RadioItem value="c" label="Option C" />
    </RadioGroup>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-end' }}>
      <RadioGroup name="r-16" defaultValue="x"><RadioItem value="x" size={16} label="16 px" /></RadioGroup>
      <RadioGroup name="r-20" defaultValue="x"><RadioItem value="x" size={20} label="20 px" /></RadioGroup>
      <RadioGroup name="r-24" defaultValue="x"><RadioItem value="x" size={24} label="24 px" /></RadioGroup>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 32 }}>
      <RadioGroup name="r-s1"><RadioItem value="a" label="Unselected" /></RadioGroup>
      <RadioGroup name="r-s2" defaultValue="a"><RadioItem value="a" label="Selected" /></RadioGroup>
      <RadioGroup name="r-s3"><RadioItem value="a" label="Hover" forceState="hover" /></RadioGroup>
      <RadioGroup name="r-s4"><RadioItem value="a" label="Focused" forceState="focus" /></RadioGroup>
      <RadioGroup name="r-s5"><RadioItem value="a" label="Disabled" disabled /></RadioGroup>
    </div>
  ),
};

interface Props {
  name: string;
}

export default function WipPage({ name }: Props) {
  return <main>{name} on progress (modified)</main>;
}

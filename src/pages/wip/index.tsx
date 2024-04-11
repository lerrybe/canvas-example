import styled from "@emotion/styled";

interface Props {
  name: string;
  color?: string;
}

export default function WipPage({ name, color }: Props) {
  return (
    <Main style={{ backgroundColor: color ?? "#fff" }}>
      {name} on progress (modified)
    </Main>
  );
}

const Main = styled.div`
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  flex-grow: 0;
  flex-shrink: 0;
  overflow-x: hidden;
  overflow-y: auto;
`;

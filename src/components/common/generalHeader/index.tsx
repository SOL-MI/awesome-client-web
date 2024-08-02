import * as S from "./styles";

interface IGeneralHeaderProps {
  title?: string;
  sub?: string;
  description?: string;
  titleSize?: "xs" | "sm" | "md" | "lg";
  spacingSize?: "sm" | "md";
}

/**
 * GeneralHeader
 * @param title 타이틀
 * @param sub 타이틀 옆 글자(ex. 더보기)
 * @param description 설명
 * @param titleSize 타이틀 사이즈(xs, sm, md, lg)
 * @param spacingSize padding 사이즈(sm, md)
 * @returns
 */

const GeneralHeader = ({ title, sub, description, titleSize = "xs", spacingSize = "sm" }: IGeneralHeaderProps) => {
  return (
    <S.GeneralHeaderContainer spacingSize={spacingSize}>
      <S.TopSection>
        <S.Title titleSize={titleSize}>{title}</S.Title>
        {sub?.length && <S.Sub>{sub}</S.Sub>}
      </S.TopSection>
      {description?.length && <S.Description titleSize={titleSize}>{description}</S.Description>}
    </S.GeneralHeaderContainer>
  );
};

export default GeneralHeader;

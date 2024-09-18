import { useState, useEffect } from "react";
import ClearIcon from "@/assets/icons/ClearIcon";
import Button from "@/components/common/button/index";
import Chip from "@/components/common/chip/index";
import Divider from "@/components/common/divider/index";
import GeneralHeader from "@/components/common/generalHeader/index";
import SearchBar from "@/components/common/searchBar/index";
import ListComponent from "@/components/myTrip/listComponent/index";
import * as S from "./styles";
import Appbar from "@/components/common/header/Appbar";
import RecentSearch from "@/components/search/recentSearch/index";
import { Place } from "@/types/myTrip";
import { NoResult } from "@/components/search/noResult/index";
import { useAtom } from "jotai";
import { daysAtom, planAtom, useUpdateDaysAtom } from "@/atoms/myTrip/planAtom";
import { useGetPopularPlace, useGetRecommendPlace, useSearchPlace } from "@/apis/myTrip/myTrip.queries";
import { CATEGORY_LIST } from "@/constants/homePageConstants";
import { ISLAND_LIST } from "@/constants/myTripPageConstants";

const AddPlacePage = ({ onPrev, day, planName }: { onPrev: () => void; day: number; planName?: string }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSelectedList, setShowSelectedList] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [{ islandId, planName: category }] = useAtom(planAtom);
  const recommendedPlaces: Place[] = [];

  if (planName && CATEGORY_LIST.includes(planName)) {
    if (!islandId) return;
    const { data: places } = useGetRecommendPlace({
      islandId,
      category: planName
    });
    places?.map((place: Place) => recommendedPlaces.push(place));
  } else if (category && CATEGORY_LIST.includes(category)) {
    if (!islandId) return;
    const { data: places } = useGetRecommendPlace({
      islandId,
      category
    });
    places?.map((place: Place) => recommendedPlaces.push(place));
  } else {
    if (!islandId) return;
    const { data: places } = useGetPopularPlace({ islandId });
    places?.map((place: Place) => recommendedPlaces.push(place));
  }

  // const recommendedPlaces = [
  //   {
  //     id: 1,
  //     name: "추천 장소",
  //     address: "주소",
  //     category: "관광지",
  //     x_address: "126.795841",
  //     y_address: "33.55635"
  //   }
  // ];

  const searchedPlaces = [
    {
      id: 101,
      name: "검색 장소",
      address: "주소",
      category: "관광지",
      x_address: "126.795865",
      y_address: "33.55634"
    },
    {
      id: 102,
      name: "검색 장소2",
      address: "주소",
      category: "관광지",
      x_address: "126.795841",
      y_address: "33.55635"
    }
  ];

  // const { data: searchedPlaces = [] } = useSearchPlace({
  //   keyword: searchQuery
  // });

  const [days] = useAtom(daysAtom);
  const addPlacesToDay = useUpdateDaysAtom();

  useEffect(() => {
    // 최근 검색어 불러오기
    setKeywords(["테스트", "테스트", "테스트"]);
  }, []);

  const handleAddClick = () => {
    const currentDay = days[day - 1];
    const currentPlaces: Place[] = currentDay?.places || [];

    const nextOrder = currentPlaces.length > 0 ? Math.max(...currentPlaces.map((place) => place.order || 0)) + 1 : 1;

    const placesWithOrder = selectedPlaces.map((place, index) => ({
      ...place,
      order: nextOrder + index
    }));

    addPlacesToDay(day, placesWithOrder);
    onPrev();
  };

  useEffect(() => {
    if (inputValue !== searchQuery) setSearchQuery("");
  }, [inputValue]);

  useEffect(() => {
    if (selectedPlaces.length > 0) {
      if (isSearching) {
        if (searchedPlaces.length > 0) setShowSelectedList(true);
        else setShowSelectedList(false);
      } else {
        setShowSelectedList(true);
      }
    } else {
      setShowSelectedList(false);
    }
  }, [isSearching, selectedPlaces, searchedPlaces]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleChipClick = (index: number) => {
    setInputValue(keywords[index]);
    setSearchQuery(keywords[index]);
  };

  useEffect(() => {
    if (isSearching) return;
    setInputValue("");
    setSearchQuery("");
  }, [isSearching]);

  return (
    <div
      style={{
        paddingTop: "56px",
        height: "100%",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <Appbar
        title={`Day ${day}`}
        textAlign="center"
        rightIcon1={
          <div onClick={onPrev}>
            <ClearIcon size="28" />
          </div>
        }
      />
      <div style={{ display: "flex", alignItems: "center" }}>
        <SearchBar
          autoFocus={false}
          placeholder="숙소,식당,관광명소 등을 검색해주세요"
          value={inputValue}
          onValueChange={setInputValue}
          onSearch={handleSearch}
          onFocus={() => setIsSearching(true)}
          showBackIcon={isSearching || Boolean(inputValue)}
          BackIconOnClick={() => setIsSearching(false)}
          style={{ flex: "1" }}
        />
      </div>
      <Divider size="sm" />
      {!isSearching && (
        <>
          <GeneralHeader
            title={
              planName && CATEGORY_LIST.includes(planName)
                ? `${planName}에 추천하는 장소`
                : category && CATEGORY_LIST.includes(category)
                  ? `${category}에 추천하는 장소`
                  : `${ISLAND_LIST.find((island) => island.id === islandId)?.name}의 인기장소`
            }
          />
          <S.ListContainer isSelected={selectedPlaces.length > 0}>
            {recommendedPlaces.map((place, index) => (
              <ListComponent
                key={index}
                place={place}
                onClick={() => {
                  if (selectedPlaces.some((p) => p.id === place.id)) {
                    setSelectedPlaces(selectedPlaces.filter((p) => p.id !== place.id));
                  } else {
                    setSelectedPlaces([...selectedPlaces, place]);
                  }
                }}
                checkbox
                selected={!!selectedPlaces.some((p) => p.id === place.id)}
              />
            ))}
          </S.ListContainer>
        </>
      )}
      {showSelectedList && (
        <S.BottomContainer>
          <GeneralHeader title="선택 목록" sub={`총 ${selectedPlaces.length}개`} />
          <S.ChipRow>
            {selectedPlaces.map((place) => (
              <Chip
                key={place.id}
                text={place.name}
                selected
                trailingIcon={<ClearIcon />}
                onChipClick={() => {
                  setSelectedPlaces(selectedPlaces.filter((p) => p !== place));
                }}
              />
            ))}
          </S.ChipRow>
          <Button
            text="추가하기"
            style={{ width: "calc(100% - 40px)", margin: "8px 20px" }}
            size="lg"
            onClick={handleAddClick}
          />
        </S.BottomContainer>
      )}
      {searchQuery && (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "scroll" }}>
          {searchedPlaces.length > 0 ? (
            searchedPlaces.map((place) => (
              <ListComponent
                key={place.id}
                place={place}
                onClick={() => {
                  if (selectedPlaces.some((p) => p.id === place.id)) {
                    setSelectedPlaces(selectedPlaces.filter((p) => p.id !== place.id));
                  } else {
                    setSelectedPlaces([...selectedPlaces, place]);
                  }
                }}
                checkbox
                selected={!!selectedPlaces.some((p) => p.id === place.id)}
              />
            ))
          ) : (
            <NoResult />
          )}
        </div>
      )}
      {isSearching && !inputValue && (
        <RecentSearch
          keywordList={keywords}
          onChipClick={handleChipClick}
          onChipDelete={() => {
            console.log("검색어 삭제 처리");
          }}
        />
      )}
    </div>
  );
};

export default AddPlacePage;

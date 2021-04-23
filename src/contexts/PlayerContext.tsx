import { createContext, ReactNode, useContext, useState } from "react"

type Episode = {
  title: string
  members: string
  thumbnail: string
  duration: number
  url: string
}

type PlayerContextData = {
  episodeList: Episode[] 
  currentEpisodeIndex: number
  isPlaying: boolean,
  isLooping: boolean,
  isShuffling: boolean,
  hasNext: boolean
  hasPrevius: boolean
  play: (episode: Episode) => void
  playList: (episode: Episode[], index: number) => void
  togglePlay: () => void
  playNext: () => void
  playPrevius: () => void
  toggleLoop: () => void,
  toggleShuffle: () => void,  
  clearPlayerState: () => void,  
  setPlayingState: (state: boolean) => void
}

export const PlayerContext = createContext({} as PlayerContextData)

type PlayerContextProviderProps = {
  children: ReactNode
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps){
  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)

  function play(episode: Episode){
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
    console.log('isPlaying')
  }

  function playList(list: Episode[], index: number){
    setEpisodeList(list)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)
  }

  function togglePlay(){
    setIsPlaying(!isPlaying)
  }

  function setPlayingState(state: boolean){
    setIsPlaying(state)
  }

  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length
  const hasPrevius = (currentEpisodeIndex - 1) >= 0

  function playNext(){
    if(isShuffling){
      const nextRandEpisodeIndex = Math.floor(Math.random() * episodeList.length)
      setCurrentEpisodeIndex(nextRandEpisodeIndex)
    }else if(hasNext){
      setCurrentEpisodeIndex(currentEpisodeIndex + 1)
    }
  }

  function playPrevius(){
    if(hasPrevius){
      setCurrentEpisodeIndex(currentEpisodeIndex - 1)
    }    
  }

  function toggleLoop(){
    setIsLooping(!isLooping)
  }

  function toggleShuffle(){
    setIsShuffling(!isShuffling)
  }

  function clearPlayerState(){
    setEpisodeList([])
    setCurrentEpisodeIndex(0)
  }

  return (
    <PlayerContext.Provider 
      value={{ 
        episodeList, 
        currentEpisodeIndex, 
        isPlaying, 
        isLooping,
        isShuffling,
        play,
        playList, 
        togglePlay, 
        playNext,
        playPrevius,
        setPlayingState,
        toggleLoop,
        toggleShuffle,
        clearPlayerState,
        hasNext,
        hasPrevius 
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  return useContext(PlayerContext)
}

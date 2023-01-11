export const MESSAGE_HEADERS = {
    START_ANALYZING: 'start_analyzing',
    NERD_STATISTICS: 'nerdstats',
    ASSESSMENT: 'assessment',
    FINISHED: 'finished',
    CREDITS: 'credits',
    REDIRECT: 'redirect'
  };
  
export type T_MESSAGE = {
    header: string,
    data?: any,
    archive?: any
}
  
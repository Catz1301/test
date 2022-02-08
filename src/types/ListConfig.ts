type ListConfig = {

  /**
   * How many squirrels to be taken a day.
   */
  squirrelsPerDay: Number,
  
  /**
   * Automatically remove previous days.
   */
  autoRemoveDays: boolean,
  
  /** 
   *  Includes Teapot rat if enabled.
   */
  includeTeapotRat: boolean,
}

export default ListConfig;
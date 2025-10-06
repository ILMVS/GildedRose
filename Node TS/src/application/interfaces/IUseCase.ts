export interface IUseCase<TResult> { 
  execute(): Promise<TResult>;
}
 
export interface IUseCaseWithInput<TInput, TResult> { 
  execute(input: TInput): Promise<TResult>;
}

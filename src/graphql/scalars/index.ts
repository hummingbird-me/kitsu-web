import Date from './Date';

const scalars = {
  Date,
  ISO8601DateTime: Date,
  ISO8601Date: Date,
} as const;

export type Scalars = {
  [Property in keyof typeof scalars]: NonNullable<
    ReturnType<(typeof scalars)[Property]>
  >;
};

export default scalars;

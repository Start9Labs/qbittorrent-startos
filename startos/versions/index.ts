import { VersionGraph } from '@start9labs/start-sdk'
import { current } from './current'
import { v_5_3_0_5 } from './v5.3.0_5'

export const versionGraph = VersionGraph.of({
  current,
  other: [v_5_3_0_5],
})

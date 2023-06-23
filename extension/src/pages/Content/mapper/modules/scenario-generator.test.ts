import { ScenarioGenerator } from "./ScenarioGenerator";
import { T_BITRATE_VMAF_MAP_ITEM } from "../../../../config/types/data-structures.type";

describe('Testing find_closest_match method', () => { 
    const bitrate_vmaf_map: T_BITRATE_VMAF_MAP_ITEM[] = [
        { bitrate: 1000000, vmaf: 30 },
        { bitrate: 1500000, vmaf: 45 },
        { bitrate: 2000000, vmaf: 50 },
        { bitrate: 3000000, vmaf: 60 },
        { bitrate: 5000000, vmaf: 70 },
        { bitrate: 4000000, vmaf: 55 },
      ];


      test('Finds closest match', () => {
        const expected_vmaf = 55
        const expected_output = { bitrate: 4000000, vmaf: 55 }
        expect(ScenarioGenerator.find_closest_match(expected_vmaf, bitrate_vmaf_map)).toEqual(expected_output)
      })

      test('Finds closest match', () => {
        const expected_vmaf = 25
        const expected_output = { bitrate: 1000000, vmaf: 30 }
        expect(ScenarioGenerator.find_closest_match(expected_vmaf, bitrate_vmaf_map)).toEqual(expected_output)
      })

      test('Finds closest match', () => {
        const expected_vmaf = 40
        const expected_output = { bitrate: 1500000, vmaf: 45 }
        expect(ScenarioGenerator.find_closest_match(expected_vmaf, bitrate_vmaf_map)).toEqual(expected_output)
      })

      test('Finds closest match', () => {
        const expected_vmaf = 65
        const expected_output = { bitrate: 3000000, vmaf: 60 }
        expect(ScenarioGenerator.find_closest_match(expected_vmaf, bitrate_vmaf_map)).toEqual(expected_output)
      })
})

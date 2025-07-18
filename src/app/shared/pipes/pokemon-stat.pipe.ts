import { Pipe, PipeTransform } from '@angular/core';
import { PokemonStat } from '../../models/pokemon.model';

/**
 * Custom pipe to format Pokemon stats
 * Following Angular best practices and SOLID principles
 */
@Pipe({
  name: 'pokemonStat',
  standalone: true
})
export class PokemonStatPipe implements PipeTransform {
  
  /**
   * Transforms Pokemon stat data into formatted display values
   * @param stat - Pokemon stat object
   * @param format - Output format ('percentage', 'value', 'both')
   * @returns Formatted stat value
   */
  transform(stat: PokemonStat, format: 'percentage' | 'value' | 'both' = 'both'): string {
    if (!stat) {
      return '';
    }

    const statName = this.formatStatName(stat.stat.name);
    const statValue = stat.base_stat;
    const percentage = this.calculateStatPercentage(stat.stat.name, statValue);

    switch (format) {
      case 'percentage':
        return `${percentage.toFixed(1)}%`;
      case 'value':
        return `${statValue}`;
      case 'both':
      default:
        return `${statName}: ${statValue} (${percentage.toFixed(1)}%)`;
    }
  }

  /**
   * Formats stat name for display
   * @param statName - Raw stat name from API
   * @returns Formatted stat name
   */
  private formatStatName(statName: string): string {
    const statMap: { [key: string]: string } = {
      'hp': 'HP',
      'attack': 'Ataque',
      'defense': 'Defensa',
      'special-attack': 'Ataque Especial',
      'special-defense': 'Defensa Especial',
      'speed': 'Velocidad'
    };

    return statMap[statName.toLowerCase()] || statName;
  }

  /**
   * Calculates stat percentage based on max values
   * @param statName - Stat name
   * @param statValue - Current stat value
   * @returns Percentage value
   */
  private calculateStatPercentage(statName: string, statValue: number): number {
    const maxStats = {
      'hp': 255,
      'attack': 190,
      'defense': 230,
      'special-attack': 194,
      'special-defense': 230,
      'speed': 180
    };

    const maxStat = maxStats[statName.toLowerCase() as keyof typeof maxStats];
    return maxStat ? (statValue / maxStat) * 100 : 0;
  }
} 
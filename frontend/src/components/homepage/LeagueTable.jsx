import React from 'react';
import './LeagueTable.css';

function LeagueTable() {
  const teams = [
    { rank: 1, team: 'Galatasaray', match: 30 , win: 24, lose: 1, draw: 5, points: 77 },
    { rank: 2, team: 'Fenerbahçe', match: 29 , win: 22, lose: 2, draw: 5,  points: 71 },
    { rank: 3, team: 'Samsunspor', match: 30 , win: 15, lose: 9, draw: 6,  points: 51 },
    { rank: 4, team: 'Eyüpspor', match: 29 , win: 14, lose: 8, draw: 8, points: 50 },
    { rank: 5, team: 'Beşiktaş', match: 30 , win: 13, lose: 7, draw: 10, points: 49 },
    { rank: 6, team: 'Başakşehir FK', match: 30 , win: 13, lose: 10, draw: 9, points: 45 },
    { rank: 7, team: 'Trabzonspor', match: 30 , win: 11, lose: 10, draw: 9, points: 42 },
    { rank: 8, team: 'Gaziantep FK', match: 30 , win: 12, lose: 11, draw: 6, points: 42 },
    { rank: 9, team: 'Kasımpaşa', match: 31 , win: 10, lose: 9, draw: 12, points: 42 },
    { rank: 10, team: 'Göztepe', match: 30 , win: 10, lose: 10, draw: 10, points: 40 },
    { rank: 11, team: 'Konyaspor', match: 31 , win: 11, lose: 13, draw: 7, points: 40 },
    { rank: 12, team: 'Antalyaspor', match: 30 , win: 11, lose: 12, draw: 7, points: 40 },
    { rank: 13, team: 'Kayserispor', match: 29 , win: 9, lose: 11, draw: 9, points: 36 },
    { rank: 14, team: 'Bodrum FK', match: 31 , win: 9, lose: 15, draw: 7, points: 34 },
    { rank: 15, team: 'Çaykur Rizespor', match: 29 , win: 10, lose: 15, draw: 4, points: 34 },
    { rank: 16, team: 'Alanyaspor', match: 29 , win: 8, lose: 14, draw: 7, points: 31 },
    { rank: 17, team: 'Sivasspor', match: 31 , win: 8, lose: 16, draw: 7, points: 31 },
    { rank: 18, team: 'Hatayspor', match: 30 , win: 4, lose: 19, draw: 7, points: 19 },
    { rank: 19, team: 'Adana Demirspor', match: 30 , win: 2, lose: 24, draw: 4, points: -2 },
  ];

  return (
    <div className="league-table">
      <h3 className="league-title">Süper Lig Puan Durumu</h3>
      <table>
        <thead>
          <tr>
          <th>#</th>
            <th>Takım</th>
            <th>O</th>
            <th>G</th>
            <th>Y</th>
            <th>B</th>
            <th>Puan</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr key={team.rank}>
              <td>{team.rank}</td>
              <td>{team.team}</td>
              <td>{team.match}</td>
              <td>{team.win}</td>
              <td>{team.lose}</td>
              <td>{team.draw}</td>
              <td>{team.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeagueTable;

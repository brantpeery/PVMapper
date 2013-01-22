using System;
using System.Collections.Generic;
using System.Linq;

namespace Doe.PVMapper.WebApi
{
    public class Scorecard
    {
        /// <summary>
        /// Initializes a new instance of the Scorecard class.
        /// </summary>
        public Scorecard(string tool, double rank, double score)
        {
            Tool = tool;
            Rank = rank;
            Score = score;
        }
        public string Tool { get; set; }
        public double Rank { get; set; }
        public double Score { get; set; }
    }
}

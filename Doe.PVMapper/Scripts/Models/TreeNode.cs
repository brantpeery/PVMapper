using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Doe.PVMapper.Models
{
    public sealed class TreeNode
    {
        /// <summary>
        /// Initializes a new instance of the TreeNode class.
        /// </summary>
        public TreeNode()
        {
            Leaf = true;
        }

        /// <summary>
        /// Initializes a new instance of the TreeNode class.
        /// </summary>
        public TreeNode(int id, string text)
            : this()
        {
            Id = id;
            Text = text;
        }

        public int Id { get; set; }

        public string Text { get; set; }

        public bool Leaf { get; set; }

        public string Url { get; set; }
    }
}
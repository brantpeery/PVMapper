using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using MongoRepository;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace Doe.PVMapper.Models {

  [JsonObject(MemberSerialization.OptOut)]
  public class Properties : Entity {
   
    [Key, Required, MaxLength(30)]
    public string functionName { get; set; }
    public float minValue { get; set; }
    public float maxValue { get; set; }
    public float increment { get; set; }
    public float target { get; set; }
    public float slope { get; set; }
    public string mode { get; set; }
    public int weight { get; set; }
    public string UserId { get; set; }
  }


}
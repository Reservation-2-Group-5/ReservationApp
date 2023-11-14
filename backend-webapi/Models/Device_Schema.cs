using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; //Should be good, need to check schema

namespace Reservation.Models
{
    public class Device
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Tag { get; set; } 

        [Required]
        [StringLength(255)] 
        public string Model_Category { get; set; }

        [Required]
        [StringLength(255)] 
        public string Device_Display_Name { get; set; }

        [StringLength(255)] 
        public string Assigned_To { get; set; }

        [StringLength(255)] 
        public string Reserved_NetID { get; set; }

        [StringLength(255)] 
        public string Location { get; set; }


        public bool Available { get; set; } // Assuming this is a boolean in database
        public long ReservedNetID { get; internal set; }
        public string AssignedTo { get; internal set; }

        // Maybe include navigation properties for related entities if using Entity Framework????
        // public virtual User AssignedUser { get; set; }
        // public virtual ICollection<DeviceRes> DeviceReservations { get; set; }
    }
}
